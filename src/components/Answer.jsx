import { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStarts } from "../helper";

const Answer = ({ ans, index }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStarts(ans));
    } else {
      setAnswer(ans);
    }
  }, [ans]);

  return (
    <>
      {index === 0 ? (
        <span className="text-2xl pt-2 block text-white">{answer}</span>
      ) : heading ? (
        <span className="pt-2 text-lg block font-semibold text-white">{answer}</span>
      ) : (
        <span className="text-sm pl-2 text-white">{answer}</span>
      )}
    </>
  );
};

export default Answer;
