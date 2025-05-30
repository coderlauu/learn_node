interface IOptions {
  name: string;
  age: number;
}

export default function (options: IOptions) {
  console.log(options);
}
