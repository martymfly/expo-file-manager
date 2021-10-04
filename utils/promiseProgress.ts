// https://stackoverflow.com/a/42342373/13565880

export default function allProgress(
  proms: Promise<void>[],
  progress_cb: (arg0: number) => void
) {
  let d = 0;
  progress_cb(0);
  for (const p of proms) {
    p.then(() => {
      d++;
      progress_cb((d * 100) / proms.length);
    });
  }
  return Promise.all(proms);
}
