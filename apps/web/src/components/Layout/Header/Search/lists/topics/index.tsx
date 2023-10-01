import { ITopic } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface ITopicsProps {
  className?: string;
  topics: ITopic[];
}

const Topics = ({ topics }: ITopicsProps) => {
  return (
    <>
      {topics?.length >= 1 && (
        <div>
          <div>
            <p className="text-sm text-gray-400">Konular</p>
          </div>
          {topics?.map((topic: ITopic) => (
            <Topics.Item key={topic.id} {...topic} />
          ))}
        </div>
      )}
    </>
  );
};

Topics.Item = ({ slug, entryCount, title }: ITopic) => {
  return (
    <Link
      className="flex items-center justify-between py-1 text-base text-gray-200 break-words rounded"
      href={"/topic/" + slug}
    >
      <p className="truncate">{title}</p>
      <span className="ml-5 text-sm">{entryCount || 0}</span>
    </Link>
  );
};

export default Topics;
