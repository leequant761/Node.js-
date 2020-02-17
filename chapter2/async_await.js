// // 프로미스 방식
// function findAndSaveUser(Users) {
//     Users.findOne({})
//         .then((user) => {
//             user.name = 'zero';
//             return user.save();
//         })
//         .then((user) => {
//             return Users.findOne({gender: 'm'});
//         })
//         .then((user) => {
//             // 생략
//         })
//         .catch(err => {
//             console.error(err);
//         });
// }

// // async 버전
// async function findAndSaveUser(Users) {
//     let user = await Users.findOne({});
//     user.name = 'zero';
//     user = await user.save();
//     user = await Users.findOne({ gender: 'm'});
//     // 생략
// }

// // async 버전 에러처리
// async function findAndSaveUser(Users) {
//     try{
//         let user = await Users.findOne({});
//         user.name = 'zero';
//         user = await user.save();
//         user = await Users.findOne({ gender: 'm'});
//         // 생략            
//     } catch(error) {
//         console.error(error);
//     }
// }

// async + arrow function
const findAndSaveUser = async (Users) => {
    try {
        let user = await Users.findOne({});
        user.name = 'zero';
        user = await user.save();
        user = await Users.findOne({ gender: 'm'}); 
        // 생략
    } catch(error) {
        console.error(error)
    }
}

// promise.all 대체
const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
(async () => {
    for await (promise of [promise1, promise2]) {
        console.log(promise);
    }
})();