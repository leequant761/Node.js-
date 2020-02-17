// 콜백 헬을 극복
const condition = true;
const promise = new Promise((resolve, reject) => {
    if (condition) {
        resolve('성공');
    } else {
        reject('실패');
    }
})

// promise
//     .then((message) => {
//         console.log(message); // resolve가 호출된 경우 then 실행, message에는 '성공'
//     })
//     .catch((error) => {
//         console.error(error); // reject가 호출된 경우 catch 실행
//     });

promise
    .then((message) => {
        return new Promise((resolve, reject) => {
            resolve(message);
        });
    })
    .then((message2) => {
        console.log(message2);
        return new Promise((resolve, reject) => {
            resolve(message2);
        });
    })
    .then((message3) => {
        console.log(message3);
    })
    .catch((error) => {
        console.log(error)
    });

// 기존 콜백 방식
function findAndSaveUser(Users) {
    Users.findOne({}, (err, user) => {
        if (err) {
            return console.error(err)
        }
        user.name = 'zero';
        user.save((err) => {
            if(err) {
                return console.error(err);
            }
            Users.findOne({gender: 'm'}, (err, user) => {
                // 생략;
            });
        });
    });
}
// 프로미스 방식
function findAndSaveUser(Users) {
    Users.findOne({})
        .then((user) => {
            user.name = 'zero';
            return user.save();
        })
        .then((user) => {
            return Users.findOne({gender: 'm'});
        })
        .then((user) => {
            // 생략
        })
        .catch(err => {
            console.error(err);
        });
}