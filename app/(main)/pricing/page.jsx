"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import PricingModel from "@/components/custom/PricingModel";
import Lookup from "@/data/Lookup";
import React, { useContext } from "react";

function page() {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Pricing
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            {Lookup.PRICING_DESC}
          </p>
        </div>

        {/* Token Status Card */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-6">
                <h2 className="text-lg font-medium text-gray-700">
                  Available Balance
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {userDetail?.token}{" "}
                  <span className="text-gray-500 text-lg font-normal">
                    Tokens
                  </span>
                </p>
              </div>
            </div>

            <div className="text-center md:text-right bg-blue-50 py-4 px-6 rounded-xl">
              <h2 className="font-medium text-gray-800 text-lg">
                Need more tokens?
              </h2>
              <p className="text-blue-600 font-medium">
                Upgrade your plan below
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Model Component */}
        <PricingModel />
      </div>
    </div>
  );
}

export default page;
