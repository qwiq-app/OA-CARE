// Public "exercise-videos" bucket in the project's Supabase storage.
const SUPABASE_BASE_URL = "https://xngcdlracntjukyzwsiu.supabase.co/storage/v1/object/public/exercise-videos";

export const exerciseVideos = {
    slr: `${SUPABASE_BASE_URL}/slr.mp4`,
    qs: `${SUPABASE_BASE_URL}/qs.jpeg`,
    lqs: `${SUPABASE_BASE_URL}/lqs.mp4`,
    sllr: `${SUPABASE_BASE_URL}/sllr.mp4`,
    bridging: `${SUPABASE_BASE_URL}/bridging.mp4`,
    su: `${SUPABASE_BASE_URL}/su.mp4`,
    sts: `${SUPABASE_BASE_URL}/sts.mp4`,
    msac: `${SUPABASE_BASE_URL}/msac.mp4`,
    tb: `${SUPABASE_BASE_URL}/tb.jpeg`,
    slb: `${SUPABASE_BASE_URL}/slb.mp4`,
    cswt: `${SUPABASE_BASE_URL}/cswt.mp4`,
    shs: `${SUPABASE_BASE_URL}/shs.mp4`,
    plank: `${SUPABASE_BASE_URL}/plank.jpeg`,
    lunges: `${SUPABASE_BASE_URL}/lunges.mp4`,
    squats: `${SUPABASE_BASE_URL}/squats.mp4`,
    pushups: `${SUPABASE_BASE_URL}/pushups.mp4`,
    burpees: `${SUPABASE_BASE_URL}/burpees.mp4`,
    sp: `${SUPABASE_BASE_URL}/sp.jpeg`,
    ssp: `${SUPABASE_BASE_URL}/ssp.jpeg`,
    mc: `${SUPABASE_BASE_URL}/mc.mp4`,
};
// Some exercises use a demonstration photo rather than a video.
export const isImageMedia = (url) => /\.(jpe?g|png|webp|gif)$/i.test(url || '');
