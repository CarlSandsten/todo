// Helper taken from lib.
export const uid = () => {
  let randomGen;
  let uid = "";
  for (let i = 0; i < 32; i++) {
    randomGen = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uid += "-";
    }
    uid += (i === 12 ? 4 : i === 16 ? (randomGen & 3) | 8 : randomGen).toString(
      16
    );
  }
  return uid;
};
