import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ChangeEmailCard from "./ChangeEmailCard";
import ChangePasswordCard from "./ChangePasswordCard";
import DeleteAccountCard from "./DeleteAccountCard";

export default function EditTabs() {
    return (
        <div className="flex w-full max-w-md flex-col gap-6 mx-auto mt-10">
            <Tabs defaultValue="email">
                <TabsList>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                    <ChangeEmailCard />
                </TabsContent>

                <TabsContent value="password">
                    <ChangePasswordCard />
                </TabsContent>

                <TabsContent value="account">
                    <DeleteAccountCard />
                </TabsContent>


            </Tabs>
        </div>
    )
}

