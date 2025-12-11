import EmployeeCreateView from "./EmployeeCreateView";

export default async function Employee() {
    return (
        <div className="flex flex-col min-w-0 gap-2">
            <EmployeeCreateView />
        </div>
    );
}
