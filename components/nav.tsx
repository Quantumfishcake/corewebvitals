import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const Nav: React.FC = () => {
    const { isLoaded: userLoaded, isSignedIn } = useUser();
    return (
        <div className="navbar dark-content px-5    ">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">
                    CWV
                </a>
            </div>
            <div className="flex-none">
                {!isSignedIn && (
                    <div>
                        <SignInButton />
                    </div>
                )}
                {isSignedIn && <UserButton />}
            </div>
        </div>
    )
}

export default Nav;