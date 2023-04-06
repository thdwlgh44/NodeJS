//this: 전역 객체
console.log(this); //global, 빈 객체로 출력
console.log(this === module.exports) //true

function a() {
    console.log(this === global); //true
}
a();