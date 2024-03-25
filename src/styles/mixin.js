export const mixin = {
  flex: (display = 'flex', justify = 'space-between', align = 'center') =>
    `display:${display};
    justify-content:${justify};
    align-items:${align}`,
};
