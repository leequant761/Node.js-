const express= require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
fs.readdir('uploads', (error) => {
    if (error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});

const upload = multer({
    storage: multer.diskStorage({ // 서버 디스크에 저장
        destination(req, file, cb) {
            cb(null, 'uploads/'); // callback(error, destination)
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);  // callback(error, 저장 시 파일명)
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => { // 이미지 업로드를 처리하는 라우터
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => { // 게시글 업로드를 처리하는 라우터
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g); // str.match(regex) => array
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({ // 
                where: { title: tag.slice(1).toLowerCase() } // 해쉬태그 array의 원소들을 Hashtag 테이블에 없으면 추가
            })));
            await post.addHashtags(result.map(r => r[0])); // 게시글과 해쉬태그 간의 관계를 PostHashtag 테이블에 넣게 된다
        }
        res.redirect('/');
    } catch(error) {
        console.error(error);
        next(error);
    }
});

// 해시태그 검색 기능
router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query }});
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{model: User}]}); // 유저 정보와 조인해서 가져옴
        }
        return res.render('main', {
            title: `${query} | NodeBird`,
            user: req.user,
            twits: posts,
        });
    } catch(error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;