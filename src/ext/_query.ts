export const createQuery = (slector: Slector) => {
  const query = slector.data
    .map((layer) => {
      console.log(layer);
      let markup = '';

      const localName = layer.content.filter((data) => data.type == 'localName' && data.active)[0];
      if (localName) markup += localName.value;

      const classes = layer.content
        .filter((data) => data.type == 'class' && data.active)
        .map((data) => '.' + data.value);
      if (classes && classes.length > 0) markup += classes.join('');

      const ids = layer.content.filter((data) => data.type == 'id' && data.active).map((data) => '#' + data.value);

      if (ids && ids.length > 0) markup += ids.join('');

      return markup;
    })
    .filter((el) => el)
    .reverse()
    .join(' ');

  return query;
};
