export default function debounce<T extends Function>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
