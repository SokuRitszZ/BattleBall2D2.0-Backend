import bp from "body-parser";

function bodyParser() {
  return [bp.urlencoded({ extended: false }), bp.json()];
}

export default bodyParser;
