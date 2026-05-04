type InfoTaniDetailPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default async function InfoTaniDetailPage({
	params,
}: InfoTaniDetailPageProps) {
	const { id } = await params;

	return (
		<div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-6 py-10">
			<div className="w-full rounded-3xl border border-white/40 bg-white/20 p-10 text-center shadow-xl backdrop-blur-md">
				<h1 className="text-3xl font-extrabold text-slate-900">Detail Info Tani</h1>
				<p className="mt-3 text-slate-700">ID komoditas: {id}</p>
			</div>
		</div>
	);
}
