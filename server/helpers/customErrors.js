// Technically, can be a class.
// Mainly just showing how to also do it with JS prototypes.
export function ValidationError(message = "") {
  this.name = "ValidationError";
  this.message = message;
}
ValidationError.prototype = Error.prototype;
