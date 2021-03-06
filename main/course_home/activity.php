<?php
/* For licensing terms, see /license.txt */

/**
 *  HOME PAGE FOR EACH COURSE
 *
 *  This page, included in every course's index.php is the home
 *  page. To make administration simple, the teacher edits his
 *  course from the home page. Only the login detects that the
 *  visitor is allowed to activate, deactivate home page links,
 *  access to the teachers tools (statistics, edit forums...).
 *
 * @package chamilo.course_home
 */

$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$course_id = api_get_course_int_id();
$session_id = api_get_session_id();

// Work with data post askable by admin of course
if (api_is_platform_admin()) {
    // Show message to confirm that a tool it to be hidden from available tools
    // visibility 0,1->2
    if (!empty($_GET['askDelete'])) {
        $content .='<div id="toolhide">'.get_lang('DelLk').'<br />&nbsp;&nbsp;&nbsp;
            <a href="'.api_get_self().'">'.get_lang('No').'</a>&nbsp;|&nbsp;
            <a href="'.api_get_self().'?delete=yes&id='.$id.'">'.get_lang('Yes').'</a>
        </div>';
    } elseif (isset($_GET['delete']) && $_GET['delete']) {
        /*
        * Process hiding a tools from available tools.
        */
        //where $id is set?
        $id = intval($id);
        Database::query("DELETE FROM $tool_table WHERE c_id = $course_id AND id='$id' AND added_tool=1");
    }
}

// Course legal
$enabled = api_get_plugin_setting('courselegal', 'tool_enable');
$pluginExtra = null;
if ($enabled === 'true') {
    require_once api_get_path(SYS_PLUGIN_PATH).'courselegal/config.php';
    $plugin = CourseLegalPlugin::create();
    $pluginExtra = $plugin->getTeacherLink();
}

//	COURSE ADMIN ONLY VIEW

$blocks = [];

// Start of tools for CourseAdmins (teachers/tutors)
if ($session_id === 0 && api_is_course_admin() && api_is_allowed_to_edit(null, true)) {
    $content .= '<div class="alert alert-success" style="border:0px; margin-top: 0px;padding:0px;">
		<div class="normal-message" id="id_normal_message" style="display:none">';
    $content .= Display::return_icon('indicator.gif').'&nbsp;&nbsp;';
    $content .= get_lang('PleaseStandBy');
    $content .= '</div>
		<div class="alert alert-success" id="id_confirmation_message" style="display:none"></div>
	</div>';

    $content .= $pluginExtra;

    if (api_get_setting('show_session_data') == 'true' && $session_id > 0) {
        $content .= '
        <div class="row">
            <div class="col-xs-12 col-md-12">
                <span class="viewcaption">'.get_lang('SessionData').'</span>
                <table class="course_activity_home">'.
                    CourseHome::show_session_data($session_id).'
                </table>
            </div>
        </div>';
    }

    $my_list = CourseHome::get_tools_category(TOOL_AUTHORING);

    $blocks[] = [
        'title' => get_lang('Authoring'),
        'class' => 'course-tools-author',
        'content' => CourseHome::show_tools_category($my_list)
    ];

    $list1 = CourseHome::get_tools_category(TOOL_INTERACTION);
    $list2 = CourseHome::get_tools_category(TOOL_COURSE_PLUGIN);
    $my_list = array_merge($list1, $list2);

    $blocks[] = [
        'title' => get_lang('Interaction'),
        'class' => 'course-tools-interaction',
        'content' => CourseHome::show_tools_category($my_list)
    ];

    $my_list = CourseHome::get_tools_category(TOOL_ADMIN_PLATFORM);

    $blocks[] = [
        'title' => get_lang('Administration'),
        'class' => 'course-tools-administration',
        'content' => CourseHome::show_tools_category($my_list)
    ];

} elseif (api_is_coach()) {
    $content .= $pluginExtra;
    if (api_get_setting('show_session_data') === 'true' && $session_id > 0) {
        $content .= '<div class="row">
            <div class="col-xs-12 col-md-12">
			<span class="viewcaption">'.get_lang('SessionData').'</span>
			<table class="course_activity_home">';
        $content .= CourseHome::show_session_data($session_id);
        $content .= '</table></div></div>';
    }

    $my_list = CourseHome::get_tools_category(TOOL_STUDENT_VIEW);

    $blocks[] = [
        'content' => CourseHome::show_tools_category($my_list)
    ];

    $sessionsCopy = api_get_setting('allow_session_course_copy_for_teachers');
    if ($sessionsCopy === 'true') {
        // Adding only maintenance for coaches.
        $myList = CourseHome::get_tools_category(TOOL_ADMIN_PLATFORM);
        $onlyMaintenanceList = array();

        foreach ($myList as $item) {
            if ($item['name'] === 'course_maintenance') {
                $item['link'] = 'course_info/maintenance_coach.php';

                $onlyMaintenanceList[] = $item;
            }
        }

        $blocks[] = [
            'title' => get_lang('Administration'),
            'content' => CourseHome::show_tools_category($onlyMaintenanceList)
        ];
    }
} else {
    $tools = CourseHome::get_tools_category(TOOL_STUDENT_VIEW);

    $isDrhOfCourse = CourseManager::isUserSubscribedInCourseAsDrh(
        api_get_user_id(),
        api_get_course_info()
    );

    // Force user icon for DRH
    if ($isDrhOfCourse) {
        $addUserTool = true;
        foreach ($tools as $tool) {
            if ($tool['name'] === 'user') {
                $addUserTool = false;
                break;
            }
        }

        if ($addUserTool) {
            $tools[] = array(
                'c_id' => api_get_course_int_id(),
                'name' => 'user',
                'link' => 'user/user.php',
                'image' => 'members.gif',
                'visibility' => '1',
                'admin' => '0',
                'address' => 'squaregrey.gif',
                'added_tool' => '0',
                'target' => '_self',
                'category' => 'interaction',
                'session_id' => api_get_session_id()
            );
        }
    }

    if (count($tools) > 0) {
        $blocks[] = ['content' => CourseHome::show_tools_category($tools)];
    }

    if ($isDrhOfCourse) {
        $drhTool = CourseHome::get_tools_category(TOOL_DRH);

        $blocks[] = ['content' => CourseHome::show_tools_category($drhTool)];
    }
}

$activityView = new Template('', false, false, false, false, false, false);
$activityView->assign('blocks', $blocks);

$content .= $activityView->fetch(
    $activityView->get_template('course_home/activity.tpl')
);
