export const handle = {
  response(res: any) {
    if (res.ok) {
      return res.json();
    } else {
      return res.json().then((data: any) => {
        console.error(data.code)
      });
    }
  },
  error(err: any) {
    if (err.code) {
        console.error(err.code)
    }
  }
};
