import RoomsTable from "./table";
export default async function Room() {

    // const queryClient = getQueryClient();
    // await queryClient.prefetchQuery({
    //     queryKey: ['category'],
    //     queryFn: () => serverApiService.get({ url: '/api/category', options: { next: { revalidate: 60 } } }),
    // });
    return (
        <div className="flex flex-col min-w-0 gap-2">
            <RoomsTable />
        </div>
    );
}
