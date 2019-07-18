export const dva = {
  config: {
    onError(err) {
      console.log(err);
      err.preventDefault();
    },
  },
};

export function render(oldRender) {
  oldRender();
}
