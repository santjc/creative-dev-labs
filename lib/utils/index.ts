export const getAllExperimentSlugs = async () => {
  const fs = await import('fs');
  const path = await import('path');
  const experimentsDir = path.resolve(process.cwd(), 'experiments');
  const files = fs.readdirSync(experimentsDir);

  files.sort(function (a, b) {
    return (
      fs.statSync(experimentsDir + '/' + a).birthtime.getTime() -
      fs.statSync(experimentsDir + '/' + b).birthtime.getTime()
    );
  });

  return files;
};
