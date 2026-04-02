import React, {createContext, useContext, useState, useCallback} from 'react';
import {CAMERAS, ALERTS, RECORDINGS} from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({children}) => {
  const [cameras, setCameras] = useState(CAMERAS);
  const [alerts, setAlerts] = useState(ALERTS);
  const [recordings] = useState(RECORDINGS);
  const [systemArmed, setSystemArmed] = useState(true);
  const [motionDetectionActive, setMotionDetectionActive] = useState(true);
  const [standbyMode, setStandbyMode] = useState(false);

  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  const cameraStats = {
    total: cameras.length,
    online: cameras.filter(c => c.status === 'online').length,
    recording: cameras.filter(c => c.isRecording).length,
    offline: cameras.filter(c => c.status === 'offline').length,
  };

  const toggleSystemArmed = () => setSystemArmed(prev => !prev);
  const toggleMotionDetection = () => setMotionDetectionActive(prev => !prev);
  const toggleStandbyMode = () => setStandbyMode(prev => !prev);

  const markAlertRead = useCallback((alertId) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? {...a, isRead: true} : a)),
    );
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setAlerts(prev => prev.map(a => ({...a, isRead: true})));
  }, []);

  const deleteAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  const deleteAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const updateCamera = useCallback((cameraId, updates) => {
    setCameras(prev =>
      prev.map(c => (c.id === cameraId ? {...c, ...updates} : c)),
    );
  }, []);

  const getCameraById = useCallback(
    (id) => cameras.find(c => c.id === id),
    [cameras],
  );

  const getRecordingsByCamera = useCallback(
    (cameraId) => recordings.filter(r => r.cameraId === cameraId),
    [recordings],
  );

  return (
    <AppContext.Provider
      value={{
        cameras,
        alerts,
        recordings,
        systemArmed,
        motionDetectionActive,
        standbyMode,
        unreadAlertsCount,
        cameraStats,
        toggleSystemArmed,
        toggleMotionDetection,
        toggleStandbyMode,
        markAlertRead,
        markAllAlertsRead,
        deleteAlert,
        deleteAllAlerts,
        updateCamera,
        getCameraById,
        getRecordingsByCamera,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default AppContext;
