interface GelPost {
	change: number;
	created_at: string;
	creator_id: number;
	directory: string;
	file_url: string;
	has_children: string;
	has_comments: string;
	has_notes: string;
	height: number;
	id: number;
	image: string;
	md5: string;
	owner: string;
	parent_id: number;
	post_locked: number;
	preview_height: number;
	preview_url: string;
	preview_width: number;
	rating: string;
	sample: number;
	sample_height: number;
	sample_url: string;
	sample_width: number;
	score: number;
	source: string;
	status: string;
	tags: string;
	title: string;
	width: number;
}

interface GelTag {
	id: number;
	name: string;
	count: number;
	type: number;
}
