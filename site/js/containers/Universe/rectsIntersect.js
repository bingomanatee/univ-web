/*
export default (rect1, rect2) => (!(
  rect1.right < rect2.left
  || rect1.left > rect2.right
  || rect1.top < rect2.bottom
  || rect1.bottom > rect2.top
));
*/
export default (rect1, rect2) => {/*
  console.log('rect1:', rect1);
  console.log('rect2:', rect2);
  console.log('rect1 top:', rect1.top);
  console.log('rect1 bottom:', rect1.bottom);
  console.log('rect1 left:', rect1.left);
  console.log('rect1 right:', rect1.right);*/

  return (!(
    rect1.right < rect2.left
    || rect1.left > rect2.right
    || rect1.top > rect2.bottom
    || rect1.bottom < rect2.top
  ));
};
