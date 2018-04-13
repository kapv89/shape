import {ok} from 'assert';
import Shape from '../src/Shape';

async function run() {
  console.log('testing shape');

  const validData = {
    x: 1,
    y: 2
  };

  const dataWithExtraKey = {
    x: 1,
    y: 2,
    z: 3
  };

  const invalidData = {
    x: 1,
    y: 1
  };

  const validation = new Shape({
    x: (x) => x === 1 ? null : 'invalid',
    y: (y) => new Promise((resolve) => {
      setTimeout(() => resolve(2), 300);
    }).then((val) => y === val ? null : 'invalid')
  });

  console.log('testing valid data');
  const noErr = await validation.errors(validData);
  ok(noErr === null);

  console.log('testing data with extra key');
  const extraKeyErr = await validation.errors(dataWithExtraKey);
  ok(extraKeyErr.x === null);
  ok(extraKeyErr.y === null);
  ok(extraKeyErr.z === 'invalid key');

  console.log('testing invalid data');
  const invalidDataErr = await validation.errors(invalidData);
  ok(invalidDataErr.x === null);
  ok(invalidDataErr.y === 'invalid');
}

if (require.main === module) {
  run();
}
