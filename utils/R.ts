class R {
  static SUCCESS = 0;
  static SERVICE_ERR = 1;
  static PARAM_ERR = 2;
  static AUTH_ERR = 3;

  static ok(data: any): typeR {
    return {
      code: 0,
      data,
    };
  }

  static fail(code: number, err: Error): typeR {
    return {
      code,
      msg: err.message,
    };
  }
}

type typeR =
  | {
      code: 0;
      data: any;
    }
  | {
      code: number;
      msg: string;
    };

export default R;
