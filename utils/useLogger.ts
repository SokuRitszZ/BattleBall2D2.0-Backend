import { Console } from 'console';
import fs from 'fs';
import dayjs from 'dayjs';

function useLogger() {
  const options = {
    flags: 'a',
  };
  const stderr = fs.createWriteStream(
    `log/${dayjs().format('YYYY-MM-DD')}-${
      (dayjs().hour() < 12 && 'AM') || 'PM'
    }.log`,
    options
  );
  const logger = new Console(stderr);
  return logger.log;
}

export default useLogger;
