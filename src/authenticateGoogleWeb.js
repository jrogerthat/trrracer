export const testGoogle = () => {
console.log('test??')
gapi.load('client', init)

async function init() {
    // 2. Initialize the JavaScript client library.
    await gapi.client.init({
      discoveryDocs: ['https://discovery.googleapis.com/$discovery/rest']
    });
    start();
  }

  const API_QUERY = 'android';

  async function start() {

    try {
      // 3. Make the API request.
      const apiRequest = await gapi.client.discovery.apis.list();
      const result = JSON.parse(apiRequest.body);
      
      // 4. Log the results of the API request
      const androidAPIs = result.items.filter(api => api.id.startsWith(API_QUERY));
      const androidAPITitles = androidAPIs.map(api => api.title);
      const uniqueAndroidAPITitles = [...new Set(androidAPITitles).values()];
      document.getElementById('result').innerHTML = 
        `${uniqueAndroidAPITitles.length} APIs:<br>${uniqueAndroidAPITitles.join('<br/> ')}`;
    } catch (e) {
      console.error(e);
    }
  }

}