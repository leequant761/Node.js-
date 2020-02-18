const EventEmitter = require('events');

const myEvent = new EventEmitter(); // 객체 생성
myEvent.addListener('event1', () => {
    console.log('이벤트 1');
})
myEvent.on('event2', () => {
    console.log('이벤트 2');
})
myEvent.on('event2', () => {
    console.log('이벤트 2 추가');
})

myEvent.emit('event1');
myEvent.emit('event2');

myEvent.once('event3', () => {
    console.log('이벤트 3');
})
myEvent.emit('event3');
myEvent.emit('event3');

myEvent.on('event4', () => {
    console.log('이벤트 4');
})
myEvent.removeAllListeners('event4');
myEvent.emit('event4');

const listener = () => {
    console.log('이벤트 5');
}
myEvent.removeListener('event5', listener); // 리스너 하나 제거, off 메소드랑 똑같음
myEvent.emit('event5');

console.log(myEvent.listenerCount('event2'));