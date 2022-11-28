import mung from 'express-mung';

function redact(body: any): any {
  if (!body) {
    return body;
  }
  if (Array.isArray(body)) {
    return body.map(item => redact(item));
  }
  if (body._doc) {
    const newBody = {
      ...body._doc
    };
    if (newBody.password) {
      delete newBody.password;
    }
    return newBody;
  }
  return body;
}

export default mung.json(redact);