// // old
// var candyMachine = {
//     status: {
//         name: 'node',
//         count: 5
//     },
//     getCandy: function() {
//         this.status.count--;
//         return this.status.count;
//     }
// };

// var getCandy = candyMachine.getCandy;
// var count = candyMachine.status.count;

// new
const candyMachine = {
    status: {
        name: 'node',
        count: 5
    },
    getCandy() {
        this.status.count;
    }
};
const {getCandy, status : {count}} = candyMachine

// 배열 버전
const array = ['nodejs', {}, 10, true];
const [node, obj, , bool] = array;