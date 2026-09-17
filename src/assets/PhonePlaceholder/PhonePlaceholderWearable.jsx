import "./PhonePlaceholderWearable.css";

import {
    Compass,
    CalendarDays,
    Activity,
    Settings,
    Wifi,
    Battery,
    Watch,
    CheckCircle2,
    Circle,
    HeartPulse,
    Footprints,
    Smartphone,
} from "lucide-react";

const devices = [
    { name: "Apple Watch",   sub: "Series 9 · Connected", icon: Watch, color: "#3B82F6", connected: true  },
    { name: "Apple Health",  sub: "Syncing steps & sleep", icon: HeartPulse, color: "#E25555", connected: true  },
    { name: "Google Fit",    sub: "Tap to connect",        icon: Footprints, color: "#34A853", connected: false },
    { name: "Fitbit",        sub: "Tap to connect",        icon: Smartphone, color: "#00A6A6", connected: false },
];

const syncedStats = [
    { label: "Steps",    val: "8,240",  unit: "today"  },
    { label: "Sleep",    val: "7h 20m", unit: "last night" },
    { label: "Calories", val: "340",    unit: "burned"  },
];

function PhonePlaceholderWearable() {
    return (
        <>
            <div className="wbl-phone-shadow"></div>
            <div className="wbl-phone">
                <div className="wbl-phone-header">
                    <div className="wbl-phone-time">9:41</div>
                    <div className="wbl-dynamic-island"></div>
                    <div className="wbl-phone-status">
                        <Wifi size={14} strokeWidth={2.5} />
                        <Battery size={18} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="wbl-phone-content">
                    <div className="wbl-top">
                        <div>
                            <p className="wbl-label">Integrations</p>
                            <h4 className="wbl-title">Wearable Sync</h4>
                        </div>
                        <Watch size={20} color="#4F7942" />
                    </div>

                    {/* Synced stats strip */}
                    <div className="wbl-stats-row">
                        {syncedStats.map((s) => (
                            <div className="wbl-stat" key={s.label}>
                                <span className="wbl-stat-val">{s.val}</span>
                                <span className="wbl-stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Device list */}
                    <div className="wbl-device-list">
                        {devices.map((d) => (
                            <div key={d.name} className="wbl-device-row">
                                <span className="wbl-device-icon">
                                    <d.icon size={20} strokeWidth={1.8} color={d.color} />
                                </span>
                                <div className="wbl-device-info">
                                    <span className="wbl-device-name">{d.name}</span>
                                    <span className="wbl-device-sub">{d.sub}</span>
                                </div>
                                {d.connected
                                    ? <CheckCircle2 size={18} color="#4F7942" fill="#DDEFD7" />
                                    : <Circle size={18} color="#E9ECEF" />
                                }
                            </div>
                        ))}
                    </div>

                    {/* Last sync */}
                    <p className="wbl-sync-note">Last synced · just now</p>
                </div>

                <div className="wbl-bottom-nav">
                    <div className="wbl-nav-item"><Compass size={18} /><span>Discover</span></div>
                    <div className="wbl-nav-item"><CalendarDays size={18} /><span>Plan</span></div>
                    <div className="wbl-nav-item"><Activity size={18} /><span>Track</span></div>
                    <div className="wbl-nav-item wbl-active"><Settings size={18} /><span>Settings</span></div>
                </div>
            </div>
        </>
    );
}

export default PhonePlaceholderWearable;
