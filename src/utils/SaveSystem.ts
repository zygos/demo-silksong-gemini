export const SaveSystem = {
  save: (data: any) => {
    localStorage.setItem('silksong_save', JSON.stringify(data));
  },
  load: () => {
    const data = localStorage.getItem('silksong_save');
    return data ? JSON.parse(data) : null;
  },
  clear: () => {
    localStorage.removeItem('silksong_save');
  }
};
