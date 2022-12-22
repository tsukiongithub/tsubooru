import Link from "next/link";
import type { FC } from "react";

const Navigation: FC = () => {
	return (
		<nav>
			<Link href={"/"}>Posts</Link>
			<Link href={"/settings"}>Settings</Link>
		</nav>
	);
};

export default Navigation;
