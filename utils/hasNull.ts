function hasNull(lst: any[]) {
  return !!(lst.filter(x => !x).length);
}

export default hasNull;
