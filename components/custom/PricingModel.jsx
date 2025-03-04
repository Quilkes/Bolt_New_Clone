import Lookup from "@/data/Lookup";
import React, { useContext, useEffect, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

function PricingModel() {
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  useEffect(() => {
    if (!userDetail) {
      router.push("/");
    }
  }, [userDetail]);

  const UpdateTokens = useMutation(api.users.UpdateToken);
  const [selectedOption, setSelectedOption] = useState();
  const [hoveredCard, setHoveredCard] = useState(null);

  const onPaymentSuccess = async () => {
    console.log("Pricing ---->", selectedOption?.value);
    const tokens = Number(userDetail?.token) + Number(selectedOption?.value);

    await UpdateTokens({
      token: tokens,
      userId: userDetail?._id,
    });
  };

  return (
    <div className="max-w-8xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl  text-gray-700 sm:text-4xl">
          Choose Your Token Package
        </h1>
        <p className="mt-4 text-base text-gray-500 max-w-2xl mx-auto">
          Select the token package that works best for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Lookup.PRICING_OPTIONS.map((pricing, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-lg transition-all duration-300 ${
              hoveredCard === index ? "transform -translate-y-2" : ""
            }`}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-gray-700">{pricing.name}</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                  {pricing.tokens} tokens
                </span>
              </div>
              <p className="text-gray-600 text-base mb-6">{pricing.desc}</p>
              <div className="flex items-baseline justify-center mt-8 mb-6">
                <span className="text-5xl font-bold text-gray-700">
                  ${pricing.price}
                </span>
                <span className="ml-1 text-xl text-gray-500">USD</span>
              </div>
            </div>

            <div className="p-6">
              <ul className="mb-8 space-y-4">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">Instant delivery</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">No expiration</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 text-gray-700">Secure payment</span>
                </li>
              </ul>

              <div className="mt-6">
                <PayPalButtons
                  disabled={!userDetail}
                  style={{
                    layout: "horizontal",
                    color: "blue",
                    shape: "pill",
                    label: "pay",
                  }}
                  onClick={() => {
                    setSelectedOption(pricing);
                    console.log(pricing.name);
                  }}
                  onApprove={() => onPaymentSuccess()}
                  onCancel={() => console.log("Payment Cancelled")}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: pricing.price,
                            currency_code: "USD",
                          },
                        },
                      ],
                    });
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {!userDetail && (
        <div className="mt-10 text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-700">Please log in to purchase tokens</p>
        </div>
      )}
    </div>
  );
}

export default PricingModel;
