const { exec } = require('child_process');

console.log('🌱 Starting database seeding...');

exec('node seedData.js', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Seeding failed:', error);
    return;
  }
  
  console.log(stdout);
  
  console.log('\n🧪 Starting API tests...');
  
  setTimeout(() => {
    exec('node testAPI.js', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Testing failed:', error);
        return;
      }
      
      console.log(stdout);
    });
  }, 2000); // Wait 2 seconds after seeding before testing
});