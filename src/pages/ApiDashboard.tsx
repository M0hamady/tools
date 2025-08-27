import { useEffect, useState } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import Navbar from "../components/Navbar";

interface Api {
  id: number;
  name: string;
  description?: string;
}

interface ApiEndpoint {
  id: number;
  path: string;
  method: string;
  description?: string;
  example_request?: string | Record<string, any>; // Allow string or object
  example_response?: string | Record<string, any>; // Allow string or object
}

const ApiDashboard: React.FC = () => {
  const [apis, setApis] = useState<Api[]>([]);
  const [selectedApi, setSelectedApi] = useState<Api | null>(null);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const res = await axios.get("https://tools-three-opal.vercel.app/api/apis/");
        setApis(res.data);
      } catch (err) {
        console.error("Error fetching APIs", err);
      }
    };
    fetchApis();
  }, []);

  const handleSelectApi = async (api: Api) => {
    setSelectedApi(api);
    setLoading(true);
    try {
      const res = await axios.get(
        `https://tools-three-opal.vercel.app/api/endpoints/?api=${api.id}`
      );
      setEndpoints(res.data);
      console.log("Fetched endpoints:", res.data); // Debug log
    } catch (err) {
      console.error("Error fetching endpoints", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to normalize JSON input (string or object) to an object
  const normalizeJson = (
    input?: string | Record<string, any>
  ): Record<string, any> | null => {
    if (!input) {
      console.warn("No input provided");
      return null;
    }
    if (typeof input === "object" && input !== null) {
      return input; // Already an object, no parsing needed
    }
    if (typeof input === "string") {
      try {
        const parsed = JSON.parse(input);
        if (typeof parsed !== "object" || parsed === null) {
          console.warn("Parsed JSON is not an object:", parsed);
          return null;
        }
        return parsed;
      } catch (err) {
        console.error("Error parsing JSON:", err, "Input:", input);
        return null;
      }
    }
    console.warn("Invalid input type:", typeof input);
    return null;
  };

  return (
    <div className="mx-auto">
        <Navbar />
        <div className="mt-12 px-8">
             <h1 className="text-3xl font-bold mb-6">📖 API Documentation</h1>

      {/* APIs List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Available APIs</h2>
        <div className="flex gap-3 flex-wrap">
          {apis.map((api) => (
            <button
              key={api.id}
              onClick={() => handleSelectApi(api)}
              className={`px-4 py-2 rounded-xl border shadow ${
                selectedApi?.id === api.id
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {api.name}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints Section */}
      {selectedApi && (
        <div>
          <h2 className="text-2xl font-bold mb-5">
            Endpoints for: {selectedApi.name}
          </h2>

          {loading ? (
            <p>Loading endpoints...</p>
          ) : endpoints.length > 0 ? (
            <div className="space-y-6">
              {endpoints.map((ep) => (
                <div
                  key={ep.id}
                  className="p-6 bg-white rounded-xl shadow border"
                >
                  {/* Endpoint Header */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-lg">
                      <span
                        className={`px-2 py-1 rounded text-sm mr-2 ${
                          ep.method === "GET"
                            ? "bg-green-100 text-green-700"
                            : ep.method === "POST"
                            ? "bg-blue-100 text-blue-700"
                            : ep.method === "PUT"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {ep.method}
                      </span>
                      {ep.path}
                    </p>
                  </div>

                  {/* Description */}
                  {ep.description && (
                    <p className="text-gray-600 mb-4">{ep.description}</p>
                  )}

                  {/* Request Example */}
                  {ep.example_request && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-1">📥 Request Example:</h3>
                      {(() => {
                        const normalized = normalizeJson(ep.example_request);
                        if (normalized) {
                          return (
                            <ReactJson
                              src={normalized}
                              theme="monokai"
                              collapsed={false}
                              enableClipboard={true}
                              displayDataTypes={false}
                              style={{ padding: "1rem", borderRadius: "0.5rem" }}
                            />
                          );
                        }
                        return (
                          <div className="bg-red-100 p-3 rounded text-red-600">
                            <p>Error: Invalid JSON provided.</p>
                            <pre>{JSON.stringify(ep.example_request, null, 2)}</pre>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Response Example */}
                  {ep.example_response && (
                    <div>
                      <h3 className="font-semibold mb-1">📤 Response Example:</h3>
                      {(() => {
                        const normalized = normalizeJson(ep.example_response);
                        if (normalized) {
                          return (
                            <ReactJson
                              src={normalized}
                              theme="monokai"
                              collapsed={false}
                              enableClipboard={true}
                              displayDataTypes={false}
                              style={{ padding: "1rem", borderRadius: "0.5rem" }}
                            />
                          );
                        }
                        return (
                          <div className="bg-red-100 p-3 rounded text-red-600">
                            <p>Error: Invalid JSON provided.</p>
                            <pre>{JSON.stringify(ep.example_response, null, 2)}</pre>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No endpoints found for this API.</p>
          )}
        </div>
      )}     
        </div>

    </div>
  );
};

export default ApiDashboard;