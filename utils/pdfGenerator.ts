// PDF generation utility for browser print

interface AdvisoryPDFData {
    farmerName?: string;
    village: string;
    sowingDate: string;
    variety: string;
    stage: string;
    landArea: number;
    riskType: string;
    riskLevel: string;
    recommendation: string;
    preventiveMeasures: string[];
    harvestDate: string;
    yieldEstimate: { min: number; max: number };
    weather: {
        temp: number;
        humidity: number;
        rainfall: number;
    };
    generatedAt: Date;
}

export function generateAdvisoryHTML(data: AdvisoryPDFData): string {
    const getRiskColor = (level: string) => {
        switch (level) {
            case 'CRITICAL': return '#dc2626';
            case 'HIGH': return '#ef4444';
            case 'MEDIUM': return '#eab308';
            default: return '#22c55e';
        }
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Field Advisory Report - RiceAdvisor WB</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #334155; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 2px solid #22c55e; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #22c55e; font-size: 24px; }
    .header p { color: #64748b; font-size: 14px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 16px; font-weight: bold; color: #1e293b; margin-bottom: 10px; border-left: 3px solid #22c55e; padding-left: 10px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .field { background: #f8fafc; padding: 12px; border-radius: 6px; }
    .field label { font-size: 12px; color: #64748b; display: block; }
    .field value { font-size: 16px; font-weight: 600; color: #1e293b; }
    .risk-box { padding: 20px; border-radius: 8px; margin: 15px 0; }
    .measures { list-style: none; }
    .measures li { padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: flex-start; gap: 10px; }
    .measures li::before { content: "✓"; color: #22c55e; font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌾 Field Advisory Report</h1>
    <p>RiceAdvisor WB • Generated: ${data.generatedAt.toLocaleString('en-IN')}</p>
  </div>

  <div class="section">
    <div class="section-title">Field Information</div>
    <div class="grid">
      <div class="field">
        <label>Village</label>
        <value>${data.village}</value>
      </div>
      <div class="field">
        <label>Farmer</label>
        <value>${data.farmerName || 'Not specified'}</value>
      </div>
      <div class="field">
        <label>Sowing Date</label>
        <value>${data.sowingDate}</value>
      </div>
      <div class="field">
        <label>Variety</label>
        <value>${data.variety}</value>
      </div>
      <div class="field">
        <label>Current Stage</label>
        <value>${data.stage}</value>
      </div>
      <div class="field">
        <label>Land Area</label>
        <value>${data.landArea} Acres</value>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Weather Conditions</div>
    <div class="grid">
      <div class="field">
        <label>Temperature</label>
        <value>${data.weather.temp}°C</value>
      </div>
      <div class="field">
        <label>Humidity</label>
        <value>${data.weather.humidity}%</value>
      </div>
      <div class="field">
        <label>Rainfall (7-day)</label>
        <value>${data.weather.rainfall}mm</value>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Risk Assessment</div>
    <div class="risk-box" style="background: ${getRiskColor(data.riskLevel)}20; border: 1px solid ${getRiskColor(data.riskLevel)}">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <strong style="color: ${getRiskColor(data.riskLevel)}">${data.riskType}</strong>
        <span style="background: ${getRiskColor(data.riskLevel)}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 12px;">${data.riskLevel}</span>
      </div>
      <p>${data.recommendation}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Preventive Measures</div>
    <ul class="measures">
      ${data.preventiveMeasures.map(m => `<li>${m}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Yield Forecast</div>
    <div class="grid">
      <div class="field">
        <label>Expected Harvest Date</label>
        <value>${data.harvestDate}</value>
      </div>
      <div class="field">
        <label>Estimated Yield</label>
        <value>${data.yieldEstimate.min} - ${data.yieldEstimate.max} Quintals</value>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This advisory is generated based on current weather conditions and crop stage.</p>
    <p>For more information, contact Kisan Call Center: 1800-180-1551</p>
    <p style="margin-top: 10px;">© RiceAdvisor WB • For Smallholder Paddy Farmers of West Bengal</p>
  </div>
</body>
</html>
  `;
}

export function printAdvisory(data: AdvisoryPDFData) {
    const html = generateAdvisoryHTML(data);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
}

export function downloadAdvisoryHTML(data: AdvisoryPDFData) {
    const html = generateAdvisoryHTML(data);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advisory-${data.village}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
