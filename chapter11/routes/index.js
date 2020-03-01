const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const rooms = await Room.find({}) ;
        res.render('main', { rooms, title: 'GIF 채팅방', error: req.flash('roomError')});
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.get('/room', (req, res) => {
    res.render('room', { title: 'GIF 채팅방 생성' });
});

router.post('/room', async (req, res) => { // 채팅방을 새로 만드는 라우터
    try{
        const rooms =  new Room({
            title: req.body.title,
            max: req.body.max,
            owner: req.session.color,
            password: req.body.password,
        });
        const newRoom = await rooms.save();
        const io = req.app.get('io'); // 소켓에서 정의한 io 객체에 접근
        io.of('/room').emit('newRoom', newRoom); // /room 네임스페이스에 연결된 모든 클라이언트에게 데이터를 보내는 메서드
        res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/room/:id', async (req, res, next) => { // 채팅방을 렌더링하는 라우터
    try {
        const room = await Room.findOne( { _id: req.params.id } );
        const io = req.app.get('io');
        if (!room) {
            req.flash('roomError', '존재하지 않는 방입니다.');
            return res.redirect('/');
        }
        if (room.password && room.password !== req.query.password) {
            req.flash('roomError', '비밀번호가 틀렸습니다.');
            return res.redirect('/');
        }
        const { rooms } = io.of('/chat').adapter; // 방의 목록
        if (rooms && rooms[req.params.id] && room.max <= room[req.params.id].length) { // room[req.params.id] : 해당 방의 소켓목록
            req.flash('roomError', '허용 인원이 초과하였습니다.');
            return res.redirect('/');
        }
        const chats = await Chat.find({ room: room._id}).sort('createdAt');
        return res.render('chat', {
            room,
            title: room.title,
            chats,
            user: req.session.color,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.delete('/room/:id', async (req, res, next) => {
    try {
        await Room.remove({ _id: req.params.id });
        await Chat.remove({ room: req.params.id });
        res.send('ok');
        setTimeout(() => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        }, 2000);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/room/:id/chat', async (req, res, next) => { // 채팅을 등록하는 라우터
    try {
        const chat = new Chat({
            room: req.param.id,
            user: req.session.color,
            chat: req.body.chat,
        });
        await chat.save();
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

fs.readdir('uploads', (error) => {
    if (error) {
      console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
      fs.mkdirSync('uploads');
    }
  });
  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads/');
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  });
  router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
    try {
      const chat = new Chat({
        room: req.params.id,
        user: req.session.color,
        gif: req.file.filename,
      });
      await chat.save();
      req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
      res.send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

module.exports = router;