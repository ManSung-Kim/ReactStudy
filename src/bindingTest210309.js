// 해당 코드는 React 가이드를 보던 중, 이벤트처리할 때 굳이 .bind(MODULE) 을 수행해야 함수내에서 this접근이 가능해지는 것을 보고
// 궁금해서 아래의 javascript 가이드 문서의 예제코드를 기준으로 테스트한 코드이다.
// https://developer.mozilla.org/ko/docs/Web/JavaScript/A_re-introduction_to_JavaScript 를 기준으로 테스트해보았다.

const module = {
  x: 42,
  getX: function() {
    return this.x;
  },
  setX: function() {
  	this.x = 40; // this가 지금 전역 scope에 대해(module이라는 단일 상수)한 단일값을 나타내는지
    			//테스트하기위해 setX라는 함수를 만들어보았다.
  },
};

const unboundGetX = module.getX;
console.log(unboundGetX()); // The function gets invoked at the global scope
// expected output: undefined

const boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// expected output: 42

const unboundSetX = module.setX;
const boundSetX = unboundSetX.bind(module); // module refernce로 SetX를 binding시키니까
boundSetX(); // this.x 가 40으로 변하였고
console.log(boundGetX()); // 이전에 생성해놓은 getX를 호출하여도 역시 this.x값이 변하였다. 
 // 즉, 여러번 binding을 하더라도 reference 상수가 같은 놈이면 같은 this를 가리키는것을 알 수 있다.

const boundGetX2 = unboundGetX.bind(module); // 마찬가지로 같은 module을 this로 바인딩시킨다.
console.log(boundGetX2()); // GetX2 상수역시 이전에 변경된 40을 출력한다.
