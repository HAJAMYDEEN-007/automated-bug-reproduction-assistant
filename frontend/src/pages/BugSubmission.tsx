import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createBug } from '../api';
import { ShieldCheck, Upload, FileCode, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface BugSubmissionProps {
  onSuccess: (newBug: any) => void;
}

export const BugSubmission: React.FC<BugSubmissionProps> = ({ onSuccess }) => {
  const { currentUser, currentOrg } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [stepsAttempted, setStepsAttempted] = useState('');
  const [appModule, setAppModule] = useState('Government Annual Reporting');
  const [appVersion, setAppVersion] = useState('v4.8.2-gov');
  const [os, setOs] = useState('Windows 11 Enterprise');
  const [browser, setBrowser] = useState('Edge 124.0.0');
  const [deviceEnv, setDeviceEnv] = useState('Staging Sandbox Node-04');
  const [fileFormat, setFileFormat] = useState('XML v2.1');
  const [fileVersion, setFileVersion] = useState('2.1');
  const [logs, setLogs] = useState('');
  const [errorMessages, setErrorMessages] = useState('');
  const [screenshotMetadata, setScreenshotMetadata] = useState('');
  const [historicalRef, setHistoricalRef] = useState('BUG-104');
  const [loading, setLoading] = useState(false);

  // Preset Sample Bug Loader for immediate startup testing
  const loadPreset = (presetType: string) => {
    if (presetType === 'LEGACY_XML') {
      setTitle('XMLParserError when submitting legacy XML v2.1 annual report');
      setDescription('When importing annual financial compliance reports formatted in legacy XML v2.1 format into the Government Annual Reporting module, the system crashes during DTD validation step.');
      setExpectedBehavior('Annual report should import successfully, validate schema v2.1 compliance, and produce a confirmation receipt ID.');
      setActualBehavior('Application throws XMLParserError at line 42 and aborts report processing completely.');
      setStepsAttempted('1. Log into portal.\n2. Navigate to Annual Reporting.\n3. Upload annual_report_2020_v2.1.xml.\n4. Click Submit Report.');
      setAppModule('Government Annual Reporting');
      setAppVersion('v4.8.2-gov');
      setFileFormat('XML v2.1');
      setFileVersion('2.1');
      setLogs('[2026-09-10 10:14:22] INFO: Uploading annual_report_2020_v2.1.xml (size: 4.2MB)\n[2026-09-10 10:14:23] ERROR: XMLParserError: DTD Validation failed for element <GovReportHeader version=\'2.1\'>. Entity declaration outside DTD schema range v2.1.');
      setErrorMessages("XMLParserError: DTD Validation failed for element <GovReportHeader version='2.1'>");
      setScreenshotMetadata('screenshot_annual_xml_error.png (1920x1080)');
      setHistoricalRef('BUG-104');
    } else if (presetType === 'CSV_LEGACY') {
      setTitle('CSV Delimiter Mismatch in Regional Healthcare Submissions');
      setDescription('State health data prior to 2022 used pipe | delimiters instead of commas. Importing legacy CSV triggers column count mismatch error.');
      setExpectedBehavior('Health surveillance records map to 14 standard fields.');
      setActualBehavior('CSVSchemaMismatch: Expected 14 columns, received 11 at row 42.');
      setStepsAttempted('1. Open State Health Surveillance.\n2. Upload health_data_2021.csv.\n3. Run batch processor.');
      setAppModule('State Health Surveillance');
      setAppVersion('v3.1.0');
      setFileFormat('CSV Legacy');
      setFileVersion('1.0-LEGACY');
      setLogs('[2026-09-10 11:20:00] ERROR: CSVSchemaMismatch: Expected 14 columns, received 11 at row 42.');
      setErrorMessages('CSVSchemaMismatch: Column count invalid');
      setScreenshotMetadata('csv_error_screenshot.png');
      setHistoricalRef('BUG-189');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bugData = {
        title,
        description,
        expected_behavior: expectedBehavior,
        actual_behavior: actualBehavior,
        steps_attempted: stepsAttempted,
        app_module: appModule,
        app_version: appVersion,
        os,
        browser,
        device_env: deviceEnv,
        file_format: fileFormat,
        file_version: fileVersion,
        logs,
        error_messages: errorMessages,
        screenshot_metadata: screenshotMetadata,
        historical_ref: historicalRef
      };

      const newBug = await createBug(bugData, currentUser?.id || 'usr-analyst', currentOrg?.id || 'org-mds');
      onSuccess(newBug);
    } catch (err) {
      console.error('Failed submitting bug report', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="gov-card p-5 border-l-4 border-l-sky-500 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">Submit Government Compliance Defect Report</h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture diagnostic logs, error messages, and legacy file metadata for automated scenario generation.
          </p>
        </div>
        
        {/* Sample Bug Preset Buttons */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => loadPreset('LEGACY_XML')}
            className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-600/40 text-xs px-3 py-1.5 rounded font-mono transition flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Load Preset: Legacy XML v2.1</span>
          </button>
          <button
            type="button"
            onClick={() => loadPreset('CSV_LEGACY')}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-600/40 text-xs px-3 py-1.5 rounded font-mono transition flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Load Preset: CSV Legacy</span>
          </button>
        </div>
      </div>

      {/* Preservation Policy Notice */}
      <div className="bg-sky-950/40 border border-sky-800/80 p-3.5 rounded-lg text-xs text-sky-200 flex items-center space-x-3">
        <ShieldCheck className="w-5 h-5 text-sky-400 flex-shrink-0" />
        <div>
          <strong className="font-semibold block text-[11px] uppercase tracking-wider text-sky-300">Legacy File Preservation Policy:</strong>
          <span>Original uploaded compliance files (XML, CSV, JSON) are stored unaltered in non-repudiation storage. Auto-conversion is only executed on sandboxed test copies.</span>
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="gov-card p-6 space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">Bug Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. XMLParserError when submitting legacy XML v2.1 report"
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 text-xs focus:ring-1 focus:ring-sky-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Application / Module *</label>
            <select
              value={appModule}
              onChange={(e) => setAppModule(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 text-xs"
            >
              <option value="Government Annual Reporting">Government Annual Reporting</option>
              <option value="State Health Surveillance">State Health Surveillance</option>
              <option value="Municipal Grant Distribution">Municipal Grant Distribution</option>
              <option value="Taxation Filing Module">Taxation Filing Module</option>
              <option value="Digital Identity Verification">Digital Identity Verification</option>
              <option value="Inter-Agency Portal">Inter-Agency Portal</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">App Version</label>
            <input
              type="text"
              value={appVersion}
              onChange={(e) => setAppVersion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Legacy File Format *</label>
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 text-xs font-mono"
            >
              <option value="XML v2.1">XML v2.1 (Legacy Standard)</option>
              <option value="XML v2.0">XML v2.0 (Legacy Standard)</option>
              <option value="CSV Legacy">CSV Legacy (Pipe Delimited)</option>
              <option value="JSON Current">JSON Current (v3.5 ISO-8601)</option>
              <option value="Binary XML v1.5 (Deprecated)">Binary XML v1.5 (Deprecated Format)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">File Schema Version</label>
            <input
              type="text"
              value={fileVersion}
              onChange={(e) => setFileVersion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 text-xs font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">Bug Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Expected Behaviour</label>
            <textarea
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Actual Behaviour</label>
            <textarea
              value={actualBehavior}
              onChange={(e) => setActualBehavior(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 text-xs"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">Application Logs / Console Output</label>
            <textarea
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              rows={4}
              placeholder="Paste log output e.g. [ERROR] XMLParserError: DTD validation failed..."
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-amber-300 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Exact Error Messages</label>
            <input
              type="text"
              value={errorMessages}
              onChange={(e) => setErrorMessages(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-rose-300 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Historical Incident Reference (If Known)</label>
            <input
              type="text"
              value={historicalRef}
              onChange={(e) => setHistoricalRef(e.target.value)}
              placeholder="e.g. BUG-104"
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 text-xs font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-6 rounded-lg text-xs flex items-center space-x-2 transition shadow-lg disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'Submitting & Indexing...' : 'Submit Bug Report'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
