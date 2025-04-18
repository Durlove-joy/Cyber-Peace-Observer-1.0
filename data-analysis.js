// Data Analysis Script for Cyber Peace Observer

async function fetchData() {
    try {
        // First try to fetch from the Google Sheets API
        const response = await fetch('https://script.google.com/macros/s/AKfycbwmcens5pwcDr1SiiVPhJX9itVRTmkQG4l_7-hN4SRmTDCQplrjVQ6yyUFm0L3qlGUz/exec', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Google Sheets Data:', data); // Debug log
        
        // If we got data, return it
        if (data && Array.isArray(data) && data.length > 0) {
            return data;
        }
        
        // If no data, try the SheetDB API as fallback
        const sheetdbResponse = await fetch('https://sheetdb.io/api/v1/gk4ag43gyg19l', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer gk4ag43gyg19l',
                'Accept': 'application/json'
            }
        });
        
        if (!sheetdbResponse.ok) {
            throw new Error(`SheetDB HTTP error! status: ${sheetdbResponse.status}`);
        }
        
        const sheetdbData = await sheetdbResponse.json();
        console.log('SheetDB Data:', sheetdbData); // Debug log
        
        if (sheetdbData && Array.isArray(sheetdbData) && sheetdbData.length > 0) {
            return sheetdbData;
        }
        
        throw new Error('No data available from either source');
        
    } catch (error) {
        console.error('Error fetching data:', error);
        // Return sample data only if both API calls fail
        return [
            {
                "Type": "RUMOR",
                "Catagory": "Social Media",
                "To The Location": "New York",
                "From The Location": "Online",
                "Date and Time": "2024-03-20T10:00:00",
                "Description": "Sample report for testing"
            },
            {
                "Type": "HATE SPEECH",
                "Catagory": "Online Forum",
                "To The Location": "London",
                "From The Location": "Online",
                "Date and Time": "2024-03-19T15:30:00",
                "Description": "Another sample report"
            }
        ];
    }
}

async function analyzeData() {
    const data = await fetchData();
    
    // Initialize analysis objects
    const analysis = {
        totalReports: data.length,
        typeDistribution: {},
        categoryDistribution: {},
        locationDistribution: {},
        timeDistribution: {},
        recentReports: []
    };

    // Analyze each report
    data.forEach(report => {
        // Type distribution
        const type = report.Type?.toUpperCase() || 'UNKNOWN';
        analysis.typeDistribution[type] = (analysis.typeDistribution[type] || 0) + 1;

        // Category distribution
        const category = report.Catagory || 'UNKNOWN';
        analysis.categoryDistribution[category] = (analysis.categoryDistribution[category] || 0) + 1;

        // Location distribution
        const location = report['To The Location'] || 'UNKNOWN';
        analysis.locationDistribution[location] = (analysis.locationDistribution[location] || 0) + 1;

        // Time distribution (by month)
        if (report['Date and Time']) {
            const date = new Date(report['Date and Time']);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            analysis.timeDistribution[monthYear] = (analysis.timeDistribution[monthYear] || 0) + 1;
        }

        // Get recent reports (last 5)
        if (report['Date and Time']) {
            analysis.recentReports.push({
                type: type,
                location: location,
                date: report['Date and Time'],
                description: report.Description
            });
        }
    });

    // Sort recent reports by date
    analysis.recentReports.sort((a, b) => new Date(b.date) - new Date(a.date));
    analysis.recentReports = analysis.recentReports.slice(0, 5);

    return analysis;
}

// Function to display analysis results
function displayAnalysis(analysis) {
    console.log('=== Cyber Peace Observer Data Analysis ===');
    console.log(`Total Reports: ${analysis.totalReports}`);
    
    console.log('\nType Distribution:');
    Object.entries(analysis.typeDistribution).forEach(([type, count]) => {
        const percentage = ((count / analysis.totalReports) * 100).toFixed(2);
        console.log(`${type}: ${count} (${percentage}%)`);
    });

    console.log('\nTop Categories:');
    const sortedCategories = Object.entries(analysis.categoryDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    sortedCategories.forEach(([category, count]) => {
        const percentage = ((count / analysis.totalReports) * 100).toFixed(2);
        console.log(`${category}: ${count} (${percentage}%)`);
    });

    console.log('\nTop Locations:');
    const sortedLocations = Object.entries(analysis.locationDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    sortedLocations.forEach(([location, count]) => {
        const percentage = ((count / analysis.totalReports) * 100).toFixed(2);
        console.log(`${location}: ${count} (${percentage}%)`);
    });

    console.log('\nRecent Reports:');
    analysis.recentReports.forEach(report => {
        console.log(`\nType: ${report.type}`);
        console.log(`Location: ${report.location}`);
        console.log(`Date: ${new Date(report.date).toLocaleString()}`);
        console.log(`Description: ${report.description}`);
    });
}

// Run the analysis
analyzeData().then(displayAnalysis);

// Export the analyzeData function for use in graphs.html
window.analyzeData = analyzeData; 