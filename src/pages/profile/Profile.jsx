import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {

    const { user } = useAuth();

    return (
        <>
            <main className="profile-page">

                <div className="profile-card">

                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <h1>{user?.name}</h1>

                    <p className="profile-role">
                        {user?.role}
                    </p>

                    <div className="profile-info">

                        <div>
                            <span>Name</span>
                            <strong>{user?.name}</strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>{user?.email}</strong>
                        </div>

                        <div>
                            <span>Phone</span>
                            <strong>{user?.phone || "Not provided"}</strong>
                        </div>

                        <div>
                            <span>Role</span>
                            <strong>{user?.role}</strong>
                        </div>

                    </div>

                </div>

            </main>
        </>
    );
};

export default Profile;