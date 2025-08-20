import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router";
import { ArrowLeft, Loader, MessageSquare, BookOpen, Calendar } from "lucide-react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import StudentDiscussionForum from "../../components/room/StudentDiscussionForum";
import StudentMaterials from "../../components/room/StudentMaterials";
import StudentAssessment from "../../components/room/StudentAssessment";
import CourseTimeline from "../../components/room/CourseTimeline";

const S_Room = () => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("forum"); // Default to forum

  const location = useLocation();
  const { id } = useParams();

  // Determine active tab based on URL
  useEffect(() => {
    if (location.pathname.includes('/materials')) {
      setActiveTab("materials");
    } else if (location.pathname.includes('/assessment')) {
      setActiveTab("assessment");
    } else {
      setActiveTab("forum");
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data);
      } catch (error) {
        console.log("Error in fetching room details", error);
        toast.error("Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Back to Dashboard Button - Floating left */}
        <div className="mb-6 flex justify-start">
          <Link to="/student/dashboard" className="btn btn-ghost">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {/* Room Info Header */}
              <div className="card bg-base-100 shadow-lg mb-6">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold">{room.room_name}</h1>
                      <p className="text-base-content/70">{room.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="tabs tabs-boxed mb-6">
                <Link
                  to={`/student/room/${id}/forum`}
                  className={`tab ${activeTab === "forum" ? "tab-active" : ""}`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussion Forum
                </Link>
                <Link
                  to={`/student/room/${id}/materials`}
                  className={`tab ${activeTab === "materials" ? "tab-active" : ""}`}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Materials
                </Link>
                <Link
                  to={`/student/room/${id}/assessment`}
                  className={`tab ${activeTab === "assessment" ? "tab-active" : ""}`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Assessment
                </Link>
              </div>

              {/* Tab Content */}
              {activeTab === "forum" && (
                <StudentDiscussionForum roomId={id} />
              )}

              {activeTab === "materials" && (
                <StudentMaterials roomId={id} />
              )}

              {activeTab === "assessment" && (
                <StudentAssessment roomId={id} room={room} />
              )}
            </div>
            
            {/* Timeline Sidebar */}
                                <div className="lg:col-span-1">
                      <div className="sticky top-6">
                        <CourseTimeline roomId={id} room={room} isStudent={true} />
                      </div>
                    </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default S_Room;
