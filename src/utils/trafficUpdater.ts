import axios from "axios";

const parseReferrer = (referrer: string): { platform: string } | "Direct" => {
  if (!referrer) return "Direct";

  // Extract domain up to .com
  const match = referrer.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+\.[^:/\n?]+)/
  );
  const domain = match ? match[1] : "";
  return { platform: domain };
};

export const trafficUpdater = async () => {
  const referrer = document.referrer;
  const userOrigin = localStorage.getItem("referrer");
  console.log(userOrigin, referrer);
  if (!userOrigin) {
    localStorage.setItem("referrer", referrer);
    const source = referrer
      ? { Referrer: parseReferrer(referrer) }
      : { Direct: null };

    await axios.post(
      `${process.env.NEXT_PUBLIC_ANALYTIC_BACKEND}/update-traffic`,
      {
        source,
      }
    );
  } else {
    if (userOrigin !== referrer) {
      localStorage.setItem("referrer", referrer);
    }
  }
};
