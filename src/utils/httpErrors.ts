export class HttpError extends Error { status: number; constructor(status:number, msg:string){ super(msg); this.status=status; } }
export class NotFound extends HttpError { constructor(msg='Not found'){ super(404,msg); } }
export class BadRequest extends HttpError { constructor(msg='Bad request'){ super(400,msg); } }
