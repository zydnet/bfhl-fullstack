import { useState } from 'react';

function App() {
  const [inputVal, setInputVal] = useState('["A->B", "A->C", "B->D"]');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);

      let data: string[] = [];
      try {
        const parsed = JSON.parse(inputVal);
        if (Array.isArray(parsed)) {
          data = parsed;
        } else {
          throw new Error("Parsed JSON is not an array");
        }
      } catch (e) {
        data = inputVal.split(',').map(s => s.trim()).filter(s => s);
      }

      const response = await fetch('https://bfhl-api-gkbz.onrender.com/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const responseData = await response.json();
      setResult(responseData);

    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the result.');
    } finally {
      setLoading(false);
    }
  }

  const renderTree = (nodeMap: any, depth = 0) => {
    if (!nodeMap || Object.keys(nodeMap).length === 0) return null;
    return (
      <ul className={`pl-4 ${depth > 0 ? 'border-l-2 border-icecube ml-3 mt-2' : ''} space-y-2`}>
        {Object.entries(nodeMap).map(([key, value]) => (
          <li key={key} className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-cambodia text-white flex items-center justify-center font-bold text-sm shadow-md">
                {key}
              </span>
            </div>
            {renderTree(value, depth + 1)}
          </li>
        ))}
      </ul>
    )
  };

  return (
    <div className="min-h-screen bg-oatmilk text-coffee font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-coffee drop-shadow-sm">
            Hierarchy Processor
          </h1>
          <p className="text-coffee/70 max-w-xl mx-auto md:text-lg font-medium">
            Build structural depths, detect cyclic references, and track node anomalies with precision.
          </p>
        </header>

        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-icecube relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-coffee"></div>

          <label className="block text-sm font-bold mb-3 text-coffee uppercase tracking-widest">
            Nodes Input
          </label>
          <textarea
            className="w-full bg-oatmilk/50 border border-icecube rounded-xl p-4 text-coffee font-mono text-sm focus:ring-2 focus:ring-mango focus:border-transparent focus:outline-none placeholder:text-coffee/40 transition-all font-medium"
            rows={5}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder='e.g., ["A->B", "A->C", "B->D"] or comma-separated A->B, A->C'
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full py-4 bg-mango hover:opacity-90 rounded-xl font-bold text-white shadow-lg shadow-mango/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? 'Processing...' : 'Analyze Data'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-mango/10 border border-mango/20 text-mango rounded-xl font-mono text-sm flex items-center gap-2 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </section>

        {result && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white rounded-2xl p-6 border border-icecube shadow-sm relative overflow-hidden group">
                <p className="text-4xl font-black text-cambodia drop-shadow-sm relative z-10">{result.summary.total_trees}</p>
                <p className="text-cambodia/70 text-sm mt-2 uppercase tracking-widest font-bold relative z-10">Total Trees</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-icecube shadow-sm relative overflow-hidden group">
                <p className="text-4xl font-black text-mango drop-shadow-sm relative z-10">{result.summary.total_cycles}</p>
                <p className="text-mango/70 text-sm mt-2 uppercase tracking-widest font-bold relative z-10">Total Cycles</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-icecube shadow-sm relative overflow-hidden group">
                <p className="text-4xl font-black text-coffee drop-shadow-sm relative z-10">
                  {result.summary.largest_tree_root || '--'}
                </p>
                <p className="text-coffee/70 text-sm mt-2 uppercase tracking-widest font-bold relative z-10">Largest Tree Root</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
              <div className="bg-white rounded-2xl border border-icecube shadow-sm overflow-hidden flex flex-col">
                <div className="border-b border-icecube bg-oatmilk p-5">
                  <h3 className="font-bold text-coffee flex items-center gap-2 text-lg">
                    Hierarchy Map
                  </h3>
                </div>
                <div className="p-6 space-y-6 flex-1 bg-white">
                  {result.hierarchies.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-coffee/50 italic text-sm font-medium">
                      No valid components generated.
                    </div>
                  ) : (
                    result.hierarchies.map((hier: any, idx: number) => (
                      <div key={idx} className="bg-oatmilk/50 p-5 rounded-2xl border border-icecube relative overflow-hidden">
                        {!hier.has_cycle && <div className="absolute left-0 top-0 w-1.5 h-full bg-cambodia"></div>}
                        {hier.has_cycle && <div className="absolute left-0 top-0 w-1.5 h-full bg-mango"></div>}

                        <div className="flex justify-between items-center mb-6 pl-2">
                          <div className="flex items-center gap-3">
                            <span className={`font-bold tracking-wide ${hier.has_cycle ? 'text-mango' : 'text-cambodia'}`}>
                              {hier.has_cycle ? 'Cyclic Group' : 'Tree Component'}
                            </span>
                          </div>
                          {!hier.has_cycle ? (
                            <span className="px-3 py-1 bg-icecube/50 text-coffee text-xs font-bold rounded-full shadow-sm">
                              Depth: {hier.depth}
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-mango/10 text-mango text-xs font-bold rounded-full">
                              Cycle
                            </span>
                          )}
                        </div>
                        {!hier.has_cycle && hier.tree && (
                          <div className="pl-2 pt-2 border-t border-icecube">
                            {renderTree(hier.tree)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-6 flex flex-col">
                <div className="bg-white rounded-2xl border border-icecube shadow-sm overflow-hidden">
                  <div className="border-b border-icecube bg-oatmilk p-5">
                    <h3 className="font-bold text-mango flex items-center gap-2">
                      Invalid Entries ({result.invalid_entries.length})
                    </h3>
                  </div>
                  <div className="p-5 flex flex-wrap gap-2 bg-white">
                    {result.invalid_entries.length === 0 ? (
                      <p className="text-coffee/50 text-sm italic font-medium">No invalid inputs.</p>
                    ) : (
                      result.invalid_entries.map((item: any, i: number) => (
                        <span key={i} className="px-3 py-1 bg-mango/10 text-mango text-xs rounded-lg border border-mango/20 font-mono font-bold">
                          {item}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-icecube shadow-sm overflow-hidden">
                  <div className="border-b border-icecube bg-oatmilk p-5">
                    <h3 className="font-bold text-coffee flex items-center gap-2">
                      Duplicate Edges ({result.duplicate_edges.length})
                    </h3>
                  </div>
                  <div className="p-5 flex flex-wrap gap-2 bg-white">
                    {result.duplicate_edges.length === 0 ? (
                      <p className="text-coffee/50 text-sm italic font-medium">No redundant edges.</p>
                    ) : (
                      result.duplicate_edges.map((item: any, i: number) => (
                        <span key={i} className="px-3 py-1 bg-icecube text-coffee text-xs rounded-lg font-mono font-bold">
                          {item}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-cambodia text-white shadow-xl rounded-2xl p-6 flex flex-col gap-3 flex-1 justify-end">
                  <div className="flex items-center gap-2 mb-2 text-icecube font-bold text-xs tracking-widest uppercase opacity-80">
                    Participant Details
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="text-white/70">User ID</span>
                    <span className="font-mono font-bold">{result.user_id}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="text-white/70">Email</span>
                    <span className="font-medium">{result.email_id}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/70">Roll No</span>
                    <span className="font-medium">{result.college_roll_number}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
export default App;
