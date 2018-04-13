## `shape`
#### Isomorphic and Async object validation library.

##### `npm install --save @krab/shape'`
##### `import Shape from '@krab/shape'`
##### `const Shape = require('@krab/shape/common')`

`shape` is used to vaidate data in an async manner. Doesn't matter if your checks are all synchronous, `shape` will check them in an async manner. This is very useful for validating data against external data sources. Example below:

```js
import Shape from '@krab/shape';

// using async-await
async function createUser(data={}) {
  const validation = new Shape({
    username: async (username) => {
      if (isString(username) && username.length > 0) {
        const existing = await findUserByUsername(username);
        return existing ? 'username taken' : null;
      } else {
        return 'invalid';
      }
    },

    password: (password) => {
      return isString(password) && password.length >= 7 ? null : 'invalid';
    },

    repeat_password: (repeat_password, {password}) => {
      return repeat_password === password ? null : 'invalid';
    }
  });

  const errors = await validation.errors(data);
  // Errors will be 'null' if all checks pass.
  // If any check fails, errors will be an object that contains error messages.
  // Validation will also fail for keys in data which are not specified when
  // defining a validation

  if (errors) {
    throw errors;
  } else {
    return await insertNewPostInDB(data);
  }
}

// using promises
function createPost(data={}) {
  const validation = new Shape({
    author_id: async (authorId) => {
      const author = await findUserById(authorId);
      return author ? null : `invalid author_id: ${authorId}`;
    },

    title: (title) => {
      return isString(title) ? findPostByTitle(title).then((existing) => {
        return (
          existing ? 'title already taken' : (
            title.length === 0 ? 'title cannot be empty' : null
          )
        );
      }) : 'title must be string';
    },

    body: (body) => {
      if (!isArray(body) || body.filter((p) => isString(p)).length < body.length) {
        return 'body must be a list of paragraph strings';
      } else if (body.length === 0) {
        return 'body cannot be empty';
      } else {
        return null;
      }
    }
  });

  return validation.errors(data).then((errors) => {
    if (errors) {
      return Promise.reject(errors);
    } else {
      return insertNewPostInDB(data);
    }
  });
}
```
