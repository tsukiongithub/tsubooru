import { useRouter } from "next/router";
import type { FC } from "react";

import isNumber from "@/common/isNumber";

const Paginator: FC = () => {
	const router = useRouter();

	const changePage = (pageDir: string) => {
		const currentPid = isNumber(router.query.pid as string);
		console.log(currentPid);
		if (pageDir === "next") {
			router.query.pid = `${currentPid + 1}`;
			router.push(router);
		} else if (pageDir === "previous" && currentPid !== 0) {
			router.query.pid = `${currentPid - 1}`;
			router.push(router);
		}
	};

	return (
		<div className="flex justify-center gap-4">
			<button
				className="btn-neutral"
				onClick={() => {
					changePage("previous");
				}}
			>
				previous
			</button>
			<button
				className="btn-neutral"
				onClick={() => {
					changePage("next");
				}}
			>
				next
			</button>
		</div>
	);
};

export default Paginator;
