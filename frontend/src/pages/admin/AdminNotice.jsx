import React from "react";
import NoticeBoard from "../../components/NoticeBoard";
import NoticeManager from "../../components/NoticeManager";
import Sidebar from "../../components/Sidebar";

const AdminNotice = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 p-6 md:p-12">
        {/* Notice Manager */}
        <div className="mb-12">
          <NoticeManager />
        </div>
        {/* Notice Board */}
        <div>
          <NoticeBoard />
        </div>
      </div>
    </div>
  );
};

export default AdminNotice;
